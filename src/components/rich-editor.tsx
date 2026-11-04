"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export function RichEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TableKit,
            Image.configure({ allowBase64: false }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: "prose p-5 min-h-64 focus:outline-none",
                role: "textbox",
                "aria-label": "Inhalt bearbeiten",
                "aria-multiline": "true",
            },
        },
    });
    useEffect(() => {
        if (editor && editor.getHTML() !== value)
            editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);
    if (!editor) return <p role="status">Editor wird geladen …</p>;
    const buttons: [string, () => void, boolean?][] = [
        ["Absatz", () => editor.chain().focus().setParagraph().run()],
        [
            "Überschrift 2",
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        ],
        [
            "Überschrift 3",
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        ],
        [
            "Fett",
            () => editor.chain().focus().toggleBold().run(),
            editor.isActive("bold"),
        ],
        [
            "Kursiv",
            () => editor.chain().focus().toggleItalic().run(),
            editor.isActive("italic"),
        ],
        ["Liste", () => editor.chain().focus().toggleBulletList().run()],
        [
            "Nummerierung",
            () => editor.chain().focus().toggleOrderedList().run(),
        ],
        ["Zitat", () => editor.chain().focus().toggleBlockquote().run()],
        [
            "Tabelle",
            () =>
                editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
        ],
        ["Rückgängig", () => editor.chain().focus().undo().run()],
    ];
    return (
        <div className="border border-[#cdd0c7] bg-white">
            <div
                className="flex flex-wrap gap-1 p-2 border-b border-[#dedfd9]"
                role="toolbar"
                aria-label="Textformatierung"
            >
                {buttons.map(([label, action, active]) => (
                    <button
                        className={
                            "px-2 py-2 text-[10px] border border-[#dedfd9] " +
                            (active ? "bg-[#e9eee1]" : "")
                        }
                        type="button"
                        onClick={action}
                        aria-pressed={active}
                        key={label}
                    >
                        {label}
                    </button>
                ))}
                <button
                    type="button"
                    className="px-2 py-2 text-[10px] border border-[#dedfd9]"
                    onClick={() => {
                        const url = window.prompt("Linkziel (https:// …)");
                        if (url && /^https:\/\//.test(url))
                            editor.chain().focus().setLink({ href: url }).run();
                    }}
                >
                    Link
                </button>
                <button
                    type="button"
                    className="px-2 py-2 text-[10px] border border-[#dedfd9]"
                    onClick={() => {
                        const url = window.prompt(
                            "Pfad einer freigegebenen Grafik auf dieser Website (/ …)",
                        );
                        if (url?.startsWith("/") && !url.startsWith("//")) {
                            const alt = window.prompt(
                                "Beschreibe den Inhalt der Grafik für Screenreader.",
                            );
                            if (alt?.trim())
                                editor
                                    .chain()
                                    .focus()
                                    .setImage({ src: url, alt })
                                    .run();
                        }
                    }}
                >
                    Grafik
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
