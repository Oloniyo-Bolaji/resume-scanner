import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Feedback {
  strengths: string[];
  weaknesses: string[];
  actionableImprovements: string[];
}

interface InsightsProps {
  feedback: Feedback;
}

const Insights = ({ feedback }: InsightsProps) => {
  return (
    <div>
      <h1 className="font-bold text-base lg:text-xl">Resume Insights</h1>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-[green]">Strengths</AccordionTrigger>
          <AccordionContent className="px-2.5 py-1.5">
            <ul className="list-disc list-inside space-y-1.5 text-balance">
              {feedback.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-[orange]">Weaknesses</AccordionTrigger>
          <AccordionContent className="px-2.5 py-1.5">
            <ul className="list-disc list-inside space-y-1.5 text-balance">
              {feedback.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-[blue]">Improvements</AccordionTrigger>
          <AccordionContent className="px-2.5 py-1.5">
            <ul className="list-disc list-inside space-y-1.5 text-balance">
              {feedback.actionableImprovements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Insights;
