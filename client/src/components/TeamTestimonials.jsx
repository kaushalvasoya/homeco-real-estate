// client/src/components/TeamTestimonials.jsx
import React from 'react';

const team = [
  {
    id: 1,
    name: 'Priya Shah',
    title: 'Head of Sales',
    img: '/sample/space3.jpg',
    bio: 'Experienced head of sales with local market expertise.'
  },
  {
    id: 2,
    name: 'Rahul Kapoor',
    title: 'Listing Manager',
    img: '/sample/prop-1.jpg',
    bio: 'Experienced listing manager with local market expertise.'
  },
  {
    id: 3,
    name: 'Asha Patel',
    title: 'Agent',
    img: '/sample/space2.jpg',
    bio: 'Experienced agent with local market expertise.'
  }
];

export default function TeamTestimonials(){
  return (
    <section className="container-lg team">
      <h3 className="text-2xl font-semibold mb-8 text-white">Meet Our Real Estate Team</h3>

      {/* grid: horizontal on desktop */}
      <div className="team-grid">
        {team.map(member => (
          <article className="team-card" key={member.id} aria-label={member.name}>
            <img className="team-avatar" src={member.img} alt={member.name} />
            <div className="team-body">
              <div className="team-name">{member.name}</div>
              <div className="team-title">{member.title}</div>
              <p className="team-bio">{member.bio}</p>
              <div className="mt-4">
                <a href={`mailto:hello@homeco.example?subject=Contact%20${encodeURIComponent(member.name)}`} className="btn btn-primary">Contact</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
