import PropTypes from 'prop-types';
import Claire from './assets/Claire.png';
import Adam from './assets/Adam.png';
import Connor from './assets/Connor.png';
import Amanda from './assets/Amanda.png';

export function Feedbacks() {
  return (
    <div className="flex w-full flex-col items-center bg-p-100 text-background">
      <div className="pb-14 md:min-w-[65rem] md:pb-28">
        <h2 className="mb-8 mt-7 text-center font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
          What other providers say
        </h2>
        <div className="flex w-[85vw] space-x-6 overflow-x-auto md:w-auto">
          <Card
            name="Claire Hayes"
            position="Licensed Mental Health Counselor"
            photo={Claire}
            text="It's an easy set up and I received my first referral within 14 days of setting up my account."
          />
          <Card
            name="Adam Holman"
            position="Licensed Clinical Social Worker"
            photo={Adam}
            text="It's a very easy to use directory, and it's great for connecting patients with the mental health resources they need."
          />
          <Card
            name="Connor Wyckoff"
            position="Licensed Clinical Social Worker"
            photo={Connor}
            text="I think MiResource is a helpful way for clients to search for someone in network with them."
          />
          <Card
            name="Amanda Lorenz, PhD"
            position="Psychologist"
            photo={Amanda}
            text="Easy platform to update my profile."
          />
        </div>
      </div>
    </div>
  );
}

function Card({ photo, text, name, position }) {
  return (
    <div className="block min-w-[15rem] text-background md:w-[15rem]">
      <img className="rounded-lg" src={photo} alt="" aria-hidden="true" />

      <p className="mt-7 text-xl">{text}</p>
      <div className="mt-6 text-[#E6F1F3]">
        <span aria-hidden="true">- </span> <span className="font-medium">{name}</span>
        <p className="ml-2	text-sm">{position}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  photo: PropTypes.elementType,
  text: PropTypes.string,
  name: PropTypes.string,
  position: PropTypes.string,
};
