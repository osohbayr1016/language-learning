#!/usr/bin/env python3
"""Generate mock exam seed SQL for HSK 1 (supports multiple parallel templates)."""

import os

from gen_exam_data import EXAM1


def esc(s: str) -> str:
    return s.replace("'", "''")


def emit(out_name: str, template_id: int, title: str, rows: list, duration: int = 35) -> None:
    out = os.path.join(os.path.dirname(__file__), "..", "migrations", out_name)
    lines = [f"-- Generated: {out_name}", f"-- Template {template_id}: {title}\n"]
    nq = len(rows)
    lines.append(
        "INSERT INTO exam_templates (id,title,hsk_level,total_questions,duration_minutes,"
        "passing_score,max_score,is_published)"
    )
    lines.append(
        f"VALUES ({template_id},'{esc(title)}',1,{nq},{duration},120,200,1);\n"
    )
    for i, (sec, part, qtype, audio, qtxt, pin, opts, correct) in enumerate(rows):
        qnum = i + 1
        lines.append(
            "INSERT INTO exam_questions (template_id,section,part_num,question_num,"
            "question_type,audio_text,question_text,question_pinyin,options,correct_answer,order_num) "
            f"VALUES ({template_id},'{sec}',{part},{qnum},'{qtype}','{esc(audio)}','{esc(qtxt)}',"
            f"'{esc(pin)}','{esc(opts)}','{esc(correct)}',{qnum});"
        )
    lines.append(f"\n-- Questions: {nq}")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {out} ({nq} qs)")


def main() -> None:
    # Template 1 and 2 share the same item bank (second sitting / parallel form).
    emit(
        "0016_mock_exam_seed.sql",
        1,
        "HSK 1 模拟考试 — 1-р mock шалгалт",
        EXAM1,
    )
    emit(
        "0019_mock_exam_seed_variant.sql",
        2,
        "HSK 1 模拟考试 — 2-р mock (давталт)",
        EXAM1,
    )


if __name__ == "__main__":
    main()
