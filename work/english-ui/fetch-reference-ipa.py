"""Read Cambridge UK/US keyword IPA into a local cache for manuscript authoring."""
import concurrent.futures
import json
import subprocess
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


class PronunciationParser(HTMLParser):
    """Capture region and IPA spans without depending on presentation whitespace."""

    def __init__(self, keyword):
        super().__init__()
        self.keyword = keyword.replace("-", " ").lower()
        self.headword = ""
        self.part_of_speech = ""
        self.spans = []
        self.region = None
        self.readings = {"uk": [], "us": []}

    def handle_starttag(self, tag, attrs):
        if tag == "span":
            self.spans.append({"classes": dict(attrs).get("class", "").split(), "text": ""})

    def handle_data(self, data):
        for span in self.spans:
            span["text"] += data

    def handle_endtag(self, tag):
        if tag != "span" or not self.spans:
            return
        span = self.spans.pop()
        if "hw" in span["classes"]:
            self.headword = span["text"].strip().replace("-", " ").lower()
        if "pos" in span["classes"]:
            self.part_of_speech = span["text"].strip()
        if "region" in span["classes"]:
            self.region = span["text"].strip()
        alternate_spelling = any("spellvar" in parent["classes"] for parent in self.spans)
        wanted_pos = {"refund": "noun", "estimate": "noun", "update": "noun", "process": "noun"}.get(self.keyword)
        correct_pos = wanted_pos is None or self.part_of_speech == wanted_pos
        if "ipa" in span["classes"] and self.region in self.readings and self.headword == self.keyword and not alternate_spelling and correct_pos:
            ipa = span["text"].strip()
            if ipa and ipa not in self.readings[self.region]:
                self.readings[self.region].append(ipa)


root = Path(__file__).resolve().parent
query = "import {quickReferenceContent as c} from './src/quick-reference-content.js'; console.log(JSON.stringify([...new Set(Object.values(c).flat().map(r=>r[2]))]));"
keywords = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", query], cwd=root, text=True))
cache_path = root.parent / "reference-ipa-cache.json"
cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}


def fetch_keyword(keyword):
    url = "https://dictionary.cambridge.org/dictionary/english/" + keyword
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        parser = PronunciationParser(keyword)
        parser.feed(response.read().decode("utf-8"))
    if not all(parser.readings.values()):
        raise ValueError(f"Missing UK/US IPA for {keyword}: {parser.readings}")
    return keyword, {"uk": parser.readings["uk"][0], "us": parser.readings["us"][0], "variants": parser.readings, "source": url, "checked": "2026-10-09", "parserVersion": 2}


failures = []
pending = [keyword for keyword in keywords if cache.get(keyword, {}).get("parserVersion") != 2]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    futures = {executor.submit(fetch_keyword, keyword): keyword for keyword in pending}
    for count, future in enumerate(concurrent.futures.as_completed(futures), 1):
        try:
            keyword, entry = future.result()
            cache[keyword] = entry
        except (urllib.error.URLError, ValueError) as error:
            failures.append(futures[future])
            print(f"FAIL {futures[future]}: {error}", flush=True)
        if count % 25 == 0:
            print(f"Checked {count}/{len(pending)} dictionary pages", flush=True)

cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")
print(f"Cached {len(cache)} keywords; unresolved: {failures}")
if failures:
    raise SystemExit(1)

# Runtime includes checked dictionary strings only; other fetched variants stay in the authoring cache.
runtime = {keyword: {field: cache[keyword][field] for field in ("uk", "us", "source", "checked")} for keyword in keywords}
(root / "src" / "reference-ipa.js").write_text("// Cambridge keyword IPA checked on 2026-10-09; keep regional labels with the readings.\nexport const keywordIPA = " + json.dumps(runtime, ensure_ascii=False, indent=2) + ";\n")
