import { testimonials } from "../constants";
import TitleHeader from "./TitleHeader";
import GlowCard from "./GlowCard";

type Testimonial = {
  name: string;
  mentions: string;
  imgPath: string;
};

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="What People Say About Me?"
          sub="⭐️ Customer feedback highlights"
        />

        <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <GlowCard card={testimonial} key={index} index={index}>
              <div className="flex items-center gap-3">
              
                <div>
                  <p className="font-bold text-white-50">{testimonial.name}</p>
                 
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
