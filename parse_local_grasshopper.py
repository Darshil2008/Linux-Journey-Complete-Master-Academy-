#!/usr/bin/env python3
"""
Local parser for all 91 lessons of Grasshopper from the cloned repo.
Outputs:
  - grasshopper_data.json (full lesson content, quizzes, code, exercises)
  - grasshopper_manifest.json (summary stats, lesson names, orders)
"""

import os
import re
import json

REPO_ROOT = '/Users/darshil/.gemini/antigravity/scratch/linux_simple_summary/repo'
LESSONS_DIR = os.path.join(REPO_ROOT, 'lessons', 'en')

GRASSHOPPER_COURSES = [
    ('getting-started', 'Getting Started', '🌱', 'Learn what Linux is, distributions, and foundational history.'),
    ('command-line', 'Command Line', '🐚', 'Master the shell, navigation, file viewing, operations, and discovery.'),
    ('text-fu', 'Text-Fu', '🥋', 'Master data streams, redirection, pipes, environment variables, and text filters.'),
    ('advanced-text-fu', 'Advanced Text-Fu', '🎯', 'Vim editor mastery, Emacs buffers, and Regular Expressions.'),
    ('user-management', 'User Management', '👥', 'User accounts, groups, /etc/passwd, /etc/shadow, root, and sudo.'),
    ('permissions', 'Permissions', '🔒', 'File permissions, octal math, chmod, chown, umask, SUID, SGID, and Sticky Bit.'),
    ('processes', 'Processes', '⚙️', 'Process monitoring, ps, top, lifecycle, signals, killing, niceness, and job control.'),
    ('packages', 'Packages', '📦', 'Debian vs Red Hat package managers, repositories, compiling source code, and tar archives.')
]

def parse_lesson_file(filepath, course_id):
    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()

    # Split frontmatter
    title = ""
    description = ""
    order_index = 999
    body = raw
    if raw.startswith('---'):
        parts = raw.split('---', 2)
        if len(parts) >= 3:
            fm = parts[1]
            body = parts[2]
            for line in fm.split('\n'):
                line_str = line.strip()
                if line_str.startswith('title:'):
                    title = line_str.replace('title:', '').strip().strip('"').strip("'")
                elif line_str.startswith('description:'):
                    description = line_str.replace('description:', '').strip().strip('"').strip("'")
                elif line_str.startswith('order_index:'):
                    try:
                        order_index = int(line_str.replace('order_index:', '').strip())
                    except:
                        pass

    filename = os.path.basename(filepath)
    lesson_id = filename[:-3] if filename.endswith('.md') else filename
    if not title:
        title = lesson_id.replace('-', ' ').title()

    # Extract Quizzes
    quizzes = []
    sc_blocks = re.findall(r':::single-choice\{#([^\}]+)\}\s*(.*?):::', body, re.DOTALL)
    for q_id, q_content in sc_blocks:
        lines = [l.strip() for l in q_content.strip().split('\n') if l.strip()]
        if not lines:
            continue
        q_text = lines[0]
        options = []
        opt_matches = re.finditer(r'::option\[([^\]]+)\]\{#([^ \}\.]+)(?:\s*(\.correct))?(?:\s*explanation="([^"]*)")?\}', q_content)
        for m in opt_matches:
            opt_text = m.group(1).strip()
            is_correct = bool(m.group(3))
            exp = m.group(4) or ""
            options.append({
                'text': opt_text,
                'correct': is_correct,
                'explanation': exp.strip()
            })
        if q_text and options:
            quizzes.append({
                'id': q_id,
                'question': q_text,
                'options': options
            })

    # Extract clean text
    clean_body = re.sub(r':::single-choice\{.*?\}', '', body, flags=re.DOTALL)
    clean_body = re.sub(r'::option\[.*?\]\{.*?\}', '', clean_body)
    clean_body = clean_body.replace(':::', '').strip()

    # Extract code snippets
    code_snippets = re.findall(r'```([a-zA-Z]*)\n(.*?)```', clean_body, re.DOTALL)

    return {
        'lesson_id': lesson_id,
        'course_id': course_id,
        'title': title,
        'order_index': order_index,
        'description': description,
        'content': clean_body,
        'code_snippets': [c[1].strip() for c in code_snippets if c[1].strip()],
        'quizzes': quizzes
    }

def main():
    all_courses_data = []
    total_lessons = 0
    total_quizzes = 0

    for course_id, course_name, icon, course_desc in GRASSHOPPER_COURSES:
        course_path = os.path.join(LESSONS_DIR, course_id)
        if not os.path.exists(course_path):
            print(f"Warning: {course_path} does not exist!")
            continue

        lessons = []
        for fname in os.listdir(course_path):
            if fname.endswith('.md'):
                fpath = os.path.join(course_path, fname)
                parsed = parse_lesson_file(fpath, course_id)
                lessons.append(parsed)

        lessons.sort(key=lambda x: (x['order_index'], x['title']))
        total_lessons += len(lessons)
        quizzes_in_course = sum(len(l['quizzes']) for l in lessons)
        total_quizzes += quizzes_in_course

        all_courses_data.append({
            'course_id': course_id,
            'course_name': course_name,
            'icon': icon,
            'description': course_desc,
            'lessons_count': len(lessons),
            'quizzes_count': quizzes_in_course,
            'lessons': lessons
        })
        print(f"Processed {course_name} ({course_id}): {len(lessons)} lessons, {quizzes_in_course} quizzes.")

    out_file = '/Users/darshil/.gemini/antigravity/scratch/linux_simple_summary/grasshopper_all_data.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_courses_data, f, indent=2)

    print(f"\nSuccessfully generated {out_file} with {total_lessons} lessons and {total_quizzes} quizzes across all 8 modules!")

if __name__ == '__main__':
    main()
