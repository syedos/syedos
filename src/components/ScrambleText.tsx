import { useTextScramble } from "@/hooks/useTextScramble";

interface ScrambleTextProps {
  text: string;
  infected: boolean;
  className?: string;
}

const ScrambleText = ({ text, infected, className }: ScrambleTextProps) => {
  const display = useTextScramble(text, infected);
  return <span className={className}>{display}</span>;
};

export default ScrambleText;
