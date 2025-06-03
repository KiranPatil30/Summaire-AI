import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";

export default  async function Page() {
  const user = await currentUser()

  // if(!user?.id){
  //   redirect('/sign-in');
    
  // }
  // const userId = user?.id;
  // const (hasRea)


  return (
    <section className="min-h-screen">
      <BgGradient />
      <MotionDiv
        // variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader />
          <UploadForm />
        </div>
      </MotionDiv>
    </section>
  );
}
