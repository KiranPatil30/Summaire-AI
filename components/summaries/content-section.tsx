import { parseEmojiPoint, parsePoint } from "@/utils/summary-helpers";
import { MotionDiv } from "../common/motion-wrapper";
import { cotainerVariants, itemVariants } from "@/utils/constants";

const EmojiPoint = ({ point }: { point: string }) => {
  const { emoji, text } = parseEmojiPoint(point) ?? {};
  return (
    <MotionDiv
      variants={itemVariants}
      className="group relative bg-gradient-to-br from-gray-200/10 to-gray-400/5 p-4 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      <div className="relative flex items-start gap-3">
        <span className="text-lg lg:text-xl shrink-0 pt-1">{emoji}</span>

        <p className="text-lg lg:text-xl text-muted-foreground/90 leading-relaxed">
          <p className="text-lg lg:text-xl text-muted-foreground/90 leading-relaxed">
            {text}
          </p>
        </p>
      </div>
    </MotionDiv>
  );
};

const RegularPoint = ({ point }: { point: string }) => {
  return (
    <MotionDiv
      variants={itemVariants}
      className="group relative bg-gradient-to-br from-gray-200/10 to-gray-400/5 p-4 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      <p className="relative text-lg lg:text-xl text-muted-foreground/90 leading-relaxed text-left">
        {point}
      </p>
    </MotionDiv>
  );
};

export default function ContentSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <MotionDiv
      variants={cotainerVariants}
      initial="hidden"
      key={points.join("")}
      whileInView="visible"
      exit="exist"
      className="space-y-4"
    >
      {points.map((point, index) => {
        const { isMainPoint, hasEmoji, isEmpty } = parsePoint(point);
        if (isEmpty) return null;
        if (hasEmoji || isMainPoint) {
          return <EmojiPoint point={point} key={`point-${index}`} />;
        }
        return <RegularPoint point={point} key={`point-${index}`} />;
      })}
    </MotionDiv>
  );
}
