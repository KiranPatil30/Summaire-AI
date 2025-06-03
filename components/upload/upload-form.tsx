// // "use client";

// // import { z } from "zod";
// // import UploadFormInput from "./upload-form-input";
// // import { useUploadThing } from "@/utils/uploadthing";
// // import { toast } from "sonner"; // ✅ Correct import
// // import { ClientUploadedFileData } from "uploadthing/types";
// // import { generatePdfSummary } from "@/action/upload-actions";
// // import { useRef, useState } from "react";
// // const schema = z.object({
// //   file: z
// //     .instanceof(File)
// //     .refine((file) => file.size > 0, "File is required")
// //     .refine(
// //       (file) => file.size < 1024 * 1024 * 10,
// //       "File must be less than 10MB"
// //     )
// //     .refine(
// //       (file) => file.type === "application/pdf",
// //       "Only PDF files are allowed"
// //     ),
// // });

// // export default function UploadForm() {
// //   const { toast } = useToast();
// //   const formRef = useRef<HTMLFormElement>(null);
// //   const [isLoading, setLoading] = useState(false);
// //   const { startUpload, isUploading } = useUploadThing("pdfUploader", {
// //     onClientUploadComplete: () => {
// //       console.log("Upload success!");
// //       toast.success("Upload successful!");
// //     },
// //     onUploadError: (err) => {
// //       console.error("Error occurred while uploading!", err);
// //       toast.error(Upload failed: ${err.message});
// //     },
// //     onUploadBegin: ({ file }) => {
// //       console.log("Upload has begun for", file);
// //       toast("Uploading file...");
// //     },
// //   });

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);

// //       const formData = new FormData(e.currentTarget);
// //       const file = formData.get("file") as File;

// //       const result = schema.safeParse({ file });
// //       if (!result.success) {
// //         toast.error(
// //           result.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
// //         );
// //         setLoading(false);
// //         return;
// //       }

// //       const resp = await startUpload([file]);

// //       if (!resp) {
// //         toast.error("Something went wrong. Please try a different file.");
// //         setLoading(false);
// //         return;
// //       }

// //       // Final success toast is handled in onClientUploadComplete
// //       const sumary = await generatePdfSummary(resp);
// //       // console.log({sumary});

// //       const { data = null, message = null } = sumary || {};
// //       if (data) {
// //         toast({
// //           title: "Saving PDF",
// //           description: "Hang tight! we are saving your summary!",
// //           status: "success",
// //         });
// //         formRef.current?.reset();
// //         if(data.summary){
// // //save in to db
// //         }
// //       }
// //     } catch (error) {
// //       setLoading(false);
// //       console.log("Error occured", error);
// //       formRef.current?.reset();
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
// //       <UploadFormInput
// //         isLoading={isLoading}
// //         ref={formRef}
// //         onSubmit={handleSubmit}
// //       />
// //     </div>
// //   );
// // }

// "use client";

// import { z } from "zod";
// import UploadFormInput from "./upload-form-input";
// import { useUploadThing } from "@/utils/uploadthing";
// import { toast } from "sonner"; // ✅ Correct import
// import {
//   generatePdfSummary,
//   generatePdfText,
//   storePdfSummaryAction,
// } from "@/action/upload-actions";
// import { useRef, useState } from "react";
// // import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";
// import LoadingSkeleton from "./loading-skeleton";
// import { formatFileNameAsTitle } from "@/utils/format-utils";

// const schema = z.object({
//   file: z
//     .instanceof(File)
//     .refine((file) => file.size > 0, "File is required")
//     .refine(
//       (file) => file.size < 1024 * 1024 * 10,
//       "File must be less than 10MB"
//     )
//     .refine(
//       (file) => file.type === "application/pdf",
//       "Only PDF files are allowed"
//     ),
// });

// export default function UploadForm() {
//   const formRef = useRef<HTMLFormElement>(null);
//   const [isLoading, setLoading] = useState(false);
//   const router = useRouter();
//   const { startUpload } = useUploadThing("pdfUploader", {
//     onClientUploadComplete: () => {
//       console.log("Upload success!");
//       toast.success("Upload successful!");
//       setLoading(false);
//       formRef.current?.reset();
//     },
//     onUploadError: (err) => {
//       console.error("Error occurred while uploading!", err);
//       toast.error(`Upload failed: ${err.message}`);
//       setLoading(false);
//     },
//     onUploadBegin: ({ file }) => {
//       console.log("Upload has begun for", file);
//       toast("Uploading file...");
//       setLoading(true);
//     },
//   });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData(e.currentTarget);
//       const file = formData.get("file") as File;

//       const result = schema.safeParse({ file });
//       if (!result.success) {
//         toast.error(
//           result.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
//         );
//         return;
//       }

//       setLoading(true);
//       const resp = await startUpload([file]);

//       if (!resp) { 
//         toast.error("Something went wrong. Please try a different file.");
//         setLoading(false);
//         return;
//       }

//       // const summary = await generatePdfSummary(resp);

//       // const { data =   null } = summary || {};

//       // if (data) {
//         let storeResult: any;
//         toast.success("Summary saved successfully!");
//         // TODO: Save summary.data.summary to DB here
        
//           // call ai servies
//           const formattedFileName = formatFileNameAsTitle(file.name);

//           const result = await generatePdfText({
//             pdfUrl: data.summary,
//           });
//           toast.success("Generate PDF Summary");

//           const summaryResult = await generatePdfSummary({
//             pdfUrl: result?.data?.pdfText ?? '',
//             fileName: formattedFileName,
//           });         
//           toast.success("Generateing PDF Summary");

//           const { data = null, message = null } = summaryResult || {};

// if (data?.summary) {
//           storeResult = await storePdfSummaryAction({
//             summary: data.summary,
//             fileUrl: resp[0].serverData.file.url,
//             title: formattedFileName,
//             fileName: file.name,
//           });
//           toast.success("Summary Saved");
//           toast.info("Your pdf has been succesfully summarized and saved");
//           formRef.current?.reset();
//           router.push(`/summaries/${storeResult.data.id}`);
        
//       }
//     } catch (error) {
//       console.error("Error occurred", error);
//       toast.error("An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center" aria-hidden="true">
//           <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//         </div>
//         <div className="relative flex justify-center">
//           <span className="bg-background px-3 text-muted-foreground text-sm">
//             Upload PDF
//           </span>
//         </div>
//       </div>
//       <UploadFormInput
//         isLoading={isLoading}
//         ref={formRef}
//         onSubmit={handleSubmit}
//       />
//       {isLoading && (
//         <>
//           <div className="relative">
//             <div
//               className="absolute inset-0 flex items-center"
//               aria-hidden="true"
//             >
//               <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-background px-3 text-muted-foreground text-sm">
//                 Processing
//               </span>
//             </div>
//           </div>
//           <LoadingSkeleton />
//         </>
//       )}
//     </div>
//   );
// }


"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryAction,
} from "@/action/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) => file.size < 1024 * 1024 * 10,
      "File must be less than 10MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Upload success!");
      toast.success("Upload successful!");
      setLoading(false);
      formRef.current?.reset();
    },
    onUploadError: (err) => {
      console.error("Error occurred while uploading!", err);
      toast.error(`Upload failed: ${err.message}`);
      setLoading(false);
    },
    onUploadBegin: ({ file }) => {
      console.log("Upload has begun for", file);
      toast("Uploading file...");
      setLoading(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const result = schema.safeParse({ file });
      if (!result.success) {
        toast.error(
          result.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
        );
        return;
      }

      setLoading(true);
      const resp = await startUpload([file]);

      if (!resp || !resp[0] || !resp[0].serverData.file.url) {
        toast.error("Something went wrong. Please try a different file.");
        setLoading(false);
        return;
      }

      const pdfUrl = resp[0].serverData.file.url;
      const formattedFileName = formatFileNameAsTitle(file.name);

      // Step 1: Extract text from the PDF
      const pdfTextResult = await generatePdfText({ pdfUrl });

      if (!pdfTextResult?.data?.pdfText) {
        toast.error("Failed to extract text from PDF.");
        setLoading(false);
        return;
      }

      // Step 2: Generate the summary from the extracted text
      const summaryResult = await generatePdfSummary(resp);

      const { data: summaryData } = summaryResult || {};
      if (!summaryData?.summary) {
        toast.error("Failed to generate summary from the PDF.");
        setLoading(false);
        return;
      }

      // Step 3: Store the summary in the database
      const storeResult = await storePdfSummaryAction({
        summary: summaryData.summary,
        fileUrl: pdfUrl,
        title: summaryData.title,
        fileName: file.name,
      });

      toast.success("Summary saved successfully!");
      toast.info("Your PDF has been successfully summarized and saved.");

      formRef.current?.reset();
      router.push(`/summaries/${storeResult.data.id}`);
    } catch (error) {
      console.error("Error occurred", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>

      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />

      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
