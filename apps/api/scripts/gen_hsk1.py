#!/usr/bin/env python3
"""Generate HSK1 full course migration SQL (0012) and optional example patch (0017)."""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from gen_hsk1_data import EXISTING, LESSONS, NEW_WORDS, example_triple_for


def esc(s: str) -> str:
    return s.replace("'", "''")


def write_0012(word_map: dict[str, int], next_id_start: int) -> None:
    out_path = os.path.join(os.path.dirname(__file__), "..", "migrations", "0012_hsk1_full_course.sql")
    lines: list[str] = []
    lines.append("-- Migration: 0012_hsk1_full_course.sql")
    lines.append("-- HSK 1 Full Course: 150 words, 15 lessons")
    lines.append(
        "-- ROLLOUT: Destructive for chapter 1 (DELETE lessons/progress below). Run once per environment;"
    )
    lines.append("--       afterward use only 0017+ idempotent patches for course tweaks.\n")

    lines.append("-- NEW HSK 1 VOCABULARY\n")

    wid = next_id_start
    for hanzi, pinyin, mn, en, pos in NEW_WORDS:
        if hanzi in word_map:
            continue
        word_map[hanzi] = wid
        ez, ep, em = "", "", ""
        triple = example_triple_for(hanzi)
        if triple:
            ez, ep, em = triple
        lines.append(
            f"INSERT OR IGNORE INTO words (id, hanzi, pinyin, pinyin_numbered, tones, "
            f"meaning_mn, meaning_en, hsk_level, part_of_speech, example_zh, example_pinyin, "
            f"example_mn, stroke_count) VALUES "
            f"({wid},'{esc(hanzi)}','{esc(pinyin)}','{esc(pinyin)}','[]',"
            f"'{esc(mn)}','{esc(en)}',1,'{esc(pos)}','{esc(ez)}','{esc(ep)}','{esc(em)}',0);"
        )
        wid += 1

    lines.append("\n-- RESTRUCTURE LESSONS (chapter 1 only)\n")
    lines.append(
        "DELETE FROM lesson_words WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 1);"
    )
    lines.append(
        "DELETE FROM user_lesson_progress WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 1);"
    )
    lines.append("DELETE FROM lessons WHERE chapter_id = 1;\n")

    lines.append("-- 15 HSK 1 LESSONS\n")
    lesson_start_id = 100
    for i, (_tz, title_mn, subtitle, icon, _words) in enumerate(LESSONS):
        lid = lesson_start_id + i
        lines.append(
            f"INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) "
            f"VALUES ({lid}, 1, '{esc(title_mn)}', '{esc(subtitle)}', '{icon}', {i + 1}, 1);"
        )

    lines.append("\n-- LESSON-WORD MAPPINGS\n")
    for i, (title_zh, _mn, _sub, _icon, word_list) in enumerate(LESSONS):
        lid = lesson_start_id + i
        lines.append(f"-- Lesson {i + 1}: {title_zh}")
        for j, hz in enumerate(word_list):
            w = word_map.get(hz)
            if w is None:
                lines.append(f"-- WARNING: '{hz}' missing from word_map")
                continue
            lines.append(
                f"INSERT OR IGNORE INTO lesson_words (lesson_id, word_id, order_num) "
                f"VALUES ({lid}, {w}, {j + 1});"
            )
        lines.append("")

    lines.append("-- UPDATE CHAPTER")
    lines.append(
        "UPDATE chapters SET title_mn = 'HSK 1 — Бүрэн курс', subtitle_mn = "
        "'Хятад хэлний анхан шат (150 үг, 15 хичээл)' WHERE id = 1;\n"
    )

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def write_0017(word_map: dict[str, int]) -> None:
    out_path = os.path.join(os.path.dirname(__file__), "..", "migrations", "0017_hsk1_examples_patch.sql")
    lines: list[str] = []
    lines.append("-- Migration: 0017_hsk1_examples_patch.sql")
    lines.append("-- Idempotent: enrich example_zh/pinyin/mn for HSK1 words (safe re-run).\n")
    for hz, wid in sorted(word_map.items(), key=lambda x: x[1]):
        triple = example_triple_for(hz)
        if not triple:
            continue
        ez, ep, em = triple
        lines.append(
            f"UPDATE words SET example_zh = '{esc(ez)}', example_pinyin = '{esc(ep)}', "
            f"example_mn = '{esc(em)}' WHERE id = {wid} AND hsk_level = 1;"
        )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main() -> None:
    word_map: dict[str, int] = dict(EXISTING)
    next_id = 26
    write_0012(word_map, next_id)
    write_0017(word_map)
    print("Wrote 0012_hsk1_full_course.sql and 0017_hsk1_examples_patch.sql")
    print(f"Total mapped words: {len(word_map)}")


if __name__ == "__main__":
    main()
