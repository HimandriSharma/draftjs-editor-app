import React, { useState, useEffect } from "react";
import {
  DraftHandleValue,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertFromRaw,
} from "draft-js";
import "../App.css";

const styleMap = {
  BOLD: {
    fontWeight: "bold",
  },
  HEADER: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  RED: {
    color: "red",
  },
  UNDERLINE: {
    textDecoration: "underline",
  },
  UNSTYLED: {
    textDecoration: "none",
    fontWeight: "normal",
    color: "black",
    fontSize: "1rem",
  },
};

const MyEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    const savedContent = localStorage.getItem("draftContent");
    const parsedContent = JSON.parse(savedContent ?? "");
    debugger;
    return savedContent
      ? parsedContent && parsedContent.blocks && parsedContent.entityMap
        ? EditorState.createWithContent(
            convertFromRaw(JSON.parse(savedContent))
          )
        : EditorState.createEmpty()
      : EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem("draftContent", JSON.stringify(contentState));
  }, [editorState]);

  const handleKeyCommand = (command: string): DraftHandleValue => {
    let newState: EditorState | null = RichUtils.handleKeyCommand(
      editorState,
      command
    );
    // console.log(newState);
    if (!newState && command === "custom-heading") {
      newState = RichUtils.toggleInlineStyle(editorState, "HEADER");
    }

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (char: string): DraftHandleValue => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();

    if (char === " ") {
      if (blockText.trim() === "#") {
        // Apply HEADING inline style using Modifier

        const newContentState = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );

        // Update the editor state with the heading content
        let updatedEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(
          RichUtils.toggleInlineStyle(updatedEditorState, "HEADER")
        );
        return "handled";
      }
      if (blockText.trim() === "***") {
        // Apply HEADING inline style using Modifier
        const headingContent = Modifier.applyInlineStyle(
          currentContent,
          selection,
          "UNDERLINE"
        );
        const newContentState = Modifier.replaceText(
          headingContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        let updatedEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(
          RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE")
        );
        return "handled";
      }
      if (blockText.trim() === "**") {
        const newContentState = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );

        let updatedEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(RichUtils.toggleInlineStyle(updatedEditorState, "RED"));
        return "handled";
      }
      if (blockText.trim() === "*") {
        const newContentState = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );

        // Update the editor state with the heading content
        let updatedEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-inline-style"
        );

        setEditorState(RichUtils.toggleInlineStyle(updatedEditorState, "BOLD"));
        return "handled";
      }
    }
    return "not-handled";
  };


  return (
    <div className="container editor">
      <Editor
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        // handleReturn={handleReturn}
      />
    </div>
  );
};

export default MyEditor;
