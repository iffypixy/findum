import {Container} from "@shared/ui";

export const Footer: React.FC = () => (
  <div className="bg-[#0B4870] py-4">
    <Container>
      <div className="flex justify-center space-x-4 text-[#FFFFFF] underline text-xs">
        <a href="/docs/privacy.html">Privacy policy</a>
        <a href="/docs/oferta.html">Public oferta</a>
        <a href="/docs/terms.html">Terms of use</a>
        <a href="/docs/policy.html">Privacy security</a>
      </div>
    </Container>
  </div>
);
