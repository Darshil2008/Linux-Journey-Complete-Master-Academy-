#!/usr/bin/env python3
"""
Extractor for all 91 lessons of the Grasshopper track from labex-labs/linuxjourney.
Extracts:
  - Title, Module, Order, Description
  - Core Explanation Text & Code Blocks
  - Hands-on Exercises
  - Quizzes (Questions, Options, Correct Answers, Explanations)
Saves into /Users/darshil/.gemini/antigravity/scratch/linux_simple_summary/grasshopper_all_data.json
"""

import urllib.request
import json
import os
import re

COURSES = [
    'getting-started',
    'command-line',
    'text-fu',
    'advanced-text-fu',
    'user-management',
    'permissions',
    'processes',
    'packages'
]

BASE_API = 'https://api.github.com/repos/labex-labs/linuxjourney/contents/lessons/en/'
RAW_BASE = 'https://raw.githubusercontent.com/labex-labs/linuxjourney/master/lessons/en/'

def clean_markdown(md_text):
    # Strip frontmatter
    if md_text.startswith('---'):
        parts = md_text.split('---', 2)
        if len(parts) >= 3:
            fm = parts[1]
            body = parts[2]
        else:
            body = md_text
    else:
        body = md_text
    return body.strip()

def parse_quizzes_and_exercises(body):
    # Extract quizzes (format: :::single-choice{#id} ... ::: or ::option[...]...)
    quizzes = []
    sc_blocks = re.findall(r':::single-choice\{#([^\}]+)\}\s*(.*?):::', body, re.DOTALL)
    for q_id, q_content in sc_blocks:
        lines = q_content.strip().split('\n')
        question_text = lines[0].strip()
        options = []
        opt_matches = re.findall(r'::option\[([^\]]+)\]\{#([^ \}\.]+)(?:\s*\.correct)?(?:\s*explanation="([^"]*)")?\}', q_content)
        for opt_text, opt_val, opt_exp in opt_matches:
            is_correct = '.correct' in q_content[q_content.find(opt_text):q_content.find(opt_text)+len(opt_text)+120]
            options.append({
                'text': opt_text.strip(),
                'correct': is_correct,
                'explanation': opt_exp.strip() if opt_exp else ""
            })
        if question_text and options:
            quizzes.append({
                'id': q_id,
                'question': question_text,
                'options': options
            })
            
    # Extract Exercises if present
    exercises = []
    ex_match = re.search(r'##\s*(?:Exercise|Hands-on|Try It Out)(.*?)(?:##|\Z)', body, re.DOTALL | re.IGNORECASE)
    if ex_match:
        exercises.append(ex_match.group(1).strip())
        
    return quizzes, exercises

def main():
    out_dir = '/Users/darshil/.gemini/antigravity/scratch/linux_simple_summary'
    os.makedirs(out_dir, exist_ok=True)
    all_modules = {}

    print("Starting extraction of all Grasshopper lessons...")
    for course in COURSES:
        print(f"Fetching course manifest for: {course}...")
        url = BASE_API + course
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req) as resp:
                files = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            print(f"Error fetching {course}: {e}")
            continue

        lessons_list = []
        for f in sorted(files, key=lambda x: x['name']):
            if not f['name'].endswith('.md'):
                continue
            download_url = f['download_url']
            lesson_id = f['name'][:-3]
            try:
                l_req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(l_req) as l_resp:
                    raw_text = l_resp.read().decode('utf-8')
            except Exception as e:
                print(f"  Error downloading {lesson_id}: {e}")
                continue

            # Parse frontmatter
            title = lesson_id.replace('-', ' ').title()
            description = ""
            order_index = 99
            if raw_text.startswith('---'):
                parts = raw_text.split('---', 2)
                if len(parts) >= 3:
                    fm = parts[1]
                    for line in fm.split('\n'):
                        if line.startswith('title:'):
                            title = line.replace('title:', '').strip().strip('"').strip("'")
                        elif line.startswith('description:'):
                            description = line.replace('description:', '').strip().strip('"').strip("'")
                        elif line.startswith('order_index:'):
                            try:
                                order_index = int(line.replace('order_index:', '').strip())
                            except:
                                pass

            body = clean_markdown(raw_text)
            quizzes, exercises = parse_quizzes_and_exercises(body)

            # Strip custom ::: directives for clean display
            clean_body = re.sub(r':::single-choice\{.*?\}', '', body, flags=re.DOTALL)
            clean_body = re.sub(r'::option\[.*?\]\{.*?\}', '', clean_body)
            clean_body = clean_body.replace(':::', '').strip()

            lessons_list.append({
                'course': course,
                'lesson_id': lesson_id,
                'title': title,
                'order_index': order_index,
                'description': description,
                'content': clean_body,
                'raw_content': body,
                'quizzes': quizzes,
                'exercises': exercises
            })
            print(f"  [OK] {course}/{lesson_id} ({len(clean_body)} chars, {len(quizzes)} quizzes)")

        # Sort by order_index
        lessons_list.sort(key=lambda x: (x['order_index'], x['title']))
        all_modules[course] = lessons_list

    out_file = os.path.join(out_dir, 'grasshopper_all_data.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_modules, f, indent=2)

    total_lessons = sum(len(v) for v in all_modules.values())
    total_quizzes = sum(sum(len(l['quizzes']) for l in v) for v in all_modules.values())
    print(f"\nSUCCESS! Extracted {total_lessons} lessons and {total_quizzes} quizzes across 8 modules into {out_file}")

if __name__ == '__main__':
    main()
