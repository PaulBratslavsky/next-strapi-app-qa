"use client";
import React from "react";
import { useActionState } from "react";

import { EditorWrapper } from "@/components/custom/editor/editor-wrapper";
import type { TSummary } from "@/types";
import { actions } from "@/data/actions";
import type { SummaryUpdateFormState, SummaryDeleteFormState } from "@/data/validation/summary";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/delete-button";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

interface ISummaryUpdateFormProps {
  summary: TSummary;
}

const INITIAL_UPDATE_STATE: SummaryUpdateFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

const INITIAL_DELETE_STATE: SummaryDeleteFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

const styles = {
  container: "flex flex-col px-2 py-0.5 relative",
  titleInput: "mb-3",
  editor: "h-[calc(100vh-215px)] overflow-y-auto",
  buttonContainer: "mt-3",
  updateButton: "inline-block",
  deleteFormContainer: "absolute bottom-0 right-2",
  deleteButton: "bg-pink-500 hover:bg-pink-600",
  fieldGroup: "space-y-1",
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [updateFormState, updateFormAction] = useActionState(
    actions.summary.updateSummaryAction,
    INITIAL_UPDATE_STATE
  );

  const [deleteFormState, deleteFormAction] = useActionState(
    actions.summary.deleteSummaryAction,
    INITIAL_DELETE_STATE
  );

  return (
    <div className={styles.container}>
      <form action={updateFormAction}>
        <input type="hidden" name="documentId" value={summary.documentId} />
        
        <div className={styles.fieldGroup}>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder={"Title"}
            defaultValue={updateFormState?.data?.title || summary.title || ""}
            className={styles.titleInput}
          />
          <ZodErrors error={updateFormState?.zodErrors?.title} />
        </div>

        <input 
          type="hidden" 
          name="content" 
          defaultValue={updateFormState?.data?.content || summary.content} 
        />

        <div className={styles.fieldGroup}>
          <EditorWrapper
            markdown={updateFormState?.data?.content || summary.content}
            onChange={(value) => {
              const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = value;
            }}
            className={styles.editor}
          />
          <ZodErrors error={updateFormState?.zodErrors?.content} />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
        
        <StrapiErrors error={updateFormState?.strapiErrors} />
        {updateFormState?.success && (
          <div className="text-green-600 mt-2">{updateFormState.message}</div>
        )}
        {updateFormState?.message && !updateFormState?.success && (
          <div className="text-red-600 mt-2">{updateFormState.message}</div>
        )}
      </form>

      <div className={styles.deleteFormContainer}>
        <form action={deleteFormAction}>
          <input type="hidden" name="documentId" value={summary.documentId} />
          <DeleteButton className={styles.deleteButton} />
        </form>
        
        <StrapiErrors error={deleteFormState?.strapiErrors} />
        {deleteFormState?.message && !deleteFormState?.success && (
          <div className="text-red-600 mt-1 text-sm">{deleteFormState.message}</div>
        )}
      </div>
    </div>
  );
}
