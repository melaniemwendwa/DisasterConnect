import React from 'react';
// *** Re-confirming this path based on the standard structure ***
import ReliefImage from '../assets/relief.png';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-Jost">
      
      {/* --- Image and Title Section (Hero) --- */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        
        {/* The Image */}
        <img 
          src={ReliefImage} 
          alt="Disaster relief scene, symbolizing crisis and response" 
          className="w-full h-full object-cover object-center"
        />
        
        {/* The Text Overlay */}
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase text-white tracking-widest p-4 text-center">
            ABOUT US
          </h1>
        </div>
      </div>
      {/* -------------------------------------- */}
      
      <main className="flex-grow p-10 md:p-16 lg:p-20 flex justify-center items-start">
        <div className="max-w-5xl w-full">
          
          {/* Expanded Body Text Block */}
          <div className="text-lg md:text-xl leading-relaxed space-y-6">
            <p className="italic">
              **Our platform, Disaster Connect, is dedicated to revolutionizing the speed and effectiveness of disaster response.** We recognized that in critical moments, complex bureaucratic processes slow down aid and cost lives. Our solution is built on four core principles: **simplification, real-time coordination, direct aid, and community empowerment.**
            </p>

            <h2 className="text-2xl font-semibold pt-4">Simplifying Disaster Reporting</h2>
            <p className="italic">
              We have radically streamlined the reporting process, moving away from cumbersome forms that require excessive data entry. Our reporting mechanism uses **minimal, high-impact fields**, focusing only on the essential information needed to locate and assess an incident: **Location, Type of Incident, and Immediate Needs.** This design allows users, whether they are on the ground or observing remotely, to **quickly submit incidents in seconds**, often via a mobile device. By reducing friction, we ensure that critical information reaches responders faster than ever before.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Enabling Real-Time Coordination</h2>
            <p className="italic">
              Disaster Connect transforms fragmented communication into a single, unified operational dashboard. Our technology enables **true real-time coordination** among multiple stakeholders—first responders, government agencies, non-profits, and independent volunteers. When an incident is reported, it instantly appears on a centralized, geospatial map. This allows response teams to visualize the crisis landscape, **avoid duplication of effort**, and allocate resources precisely where they are needed most. The real-time nature of our updates ensures that decisions are based on the freshest and most accurate situational awareness.
            </p>
            
            <h2 className="text-2xl font-semibold pt-4">Facilitating Immediate, Direct Aid</h2>
            <p className="italic">
              Our platform goes beyond just reporting incidents; it creates a dynamic marketplace for urgent help. Users are not limited to reporting—they are empowered to directly **offer tangible aid**, such as food, water, medical supplies, or financial funds, directly associated with a specific, verified incident. This removes bureaucratic intermediaries, ensuring that a donation of blankets or a cash contribution is immediately routed to the location where those items are most needed. **Help becomes immediate** because the transaction is direct and transparent.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Ensuring Help is Community-Driven</h2>
            <p className="italic">
              Disaster Connect is built on the power of the crowd. We believe the most effective help is that which is organized and driven by the people closest to the crisis. By allowing citizens, local businesses, and community groups to submit reports and offer aid, we leverage local knowledge and resources. This bottom-up approach ensures that the response is not only fast but also **culturally relevant and hyper-localized**, fostering a resilient network where neighbors help neighbors.
            </p>
            
            <p className="font-bold pt-4">
              In essence, Disaster Connect cuts through the chaos of crisis management, making every second count and placing the power of instant, intelligent relief directly into the hands of the community.
            </p>
          </div>
          
        </div>
      </main>
      
       
    </div>
  );
};

export default AboutUs;