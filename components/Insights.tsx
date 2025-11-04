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
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Strengths</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {feedback.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Weaknesses</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {feedback.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Improvements</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {feedback.actionableImprovements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Insights;
