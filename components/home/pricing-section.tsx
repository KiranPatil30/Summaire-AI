import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import { cotainerVariants } from "@/utils/constants";

type PriceType = {
  price: number;
  name: string;
  desciption: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
};
const plans = [
  {
    name: "Basic",
    id: "basic",
    desciption: "For professional and teams",
    price: 9,
    items: ["5 pdf summaries per month", "pdf summaries for 5 users"],
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://rzp.io/rzp/Mk52BFE"
        : "",
    priceId: "",
  },
  {
    name: "Pro",
    id: "pro",
    desciption: "For professional and teams",
    price: 19.99,
    items: ["10 pdf summaries per month", "pdf summaries for 5 users"],
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://rzp.io/rzp/9xCRITC"
        : "",
    priceId: "",
  },
];

const listVariant = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ype: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};
const PricingCard = ({
  name,
  price,
  desciption,
  items,
  id,
  paymentLink,
}: PriceType) => {
  return (
    <MotionDiv
      variants={listVariant}
      whileHover={{ scale: 1.02 }}
      className="realtive w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
          id === "pro" && "border-rose-500 gap-5 border-2",
        )}
      >
        <MotionDiv
          variants={listVariant}
          className="flex justify-between items-center gap-4"
        >
          <div className="">
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{desciption}</p>
          </div>
        </MotionDiv>

        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">$ {price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">USD</p>
            <p className="text-xs ">/month</p>
          </div>
        </div>
        <MotionDiv
          variants={listVariant}
          className="space-y-2.5 leading-relaxed text-base flex-1"
        >
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </MotionDiv>
        <MotionDiv
          variants={listVariant}
          className="space-y-2 flex justify-center w-full"
        >
          <Link
            href={paymentLink}
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2",
              id === "pro"
                ? "border-rose-900"
                : "border-rose-100 from-rose-400 to-rose-500",
            )}
          >
            Buy Now <ArrowRight />
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
export default function PricingSection() {
  return (
    <MotionSection
      variants={cotainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv className="flex items-center justify-center w-full pb-12">
          <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">
            Pricing
          </h2>
        </MotionDiv>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
