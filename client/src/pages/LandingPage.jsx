import React from 'react';
import { Link } from 'react-router-dom';
import LandingPageNavbar from '../components/LandingPageNavbar';
import landingPagePhoto from '../assets/landingpage photo.png';
import floodImage from '../assets/flood.jpeg';
import wildfireImage from '../assets/wildfire.jpeg';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingPageNavbar />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#1a3650]">
        <div className="absolute inset-0">
          <img 
            src={landingPagePhoto} 
            alt="Disaster relief background"
            className="w-full h-full object-cover brightness-[0.75]"
            style={{ filter: 'brightness(0.65)' }}
            onError={(e) => {
              console.log('Image failed to load:', landingPagePhoto);
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log('Image loaded successfully:', landingPagePhoto)}
          />
          
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            CONNECT, REPORT AND HELP DURING DISASTERS
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Disaster Connect is your go-to platform for reporting disasters, responding to relief efforts, and volunteering your time. Join us in making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-[#224266] text-white px-8 py-3 rounded hover:bg-[#1a3650] transition font-semibold"
            >
              Sign Up
            </Link>
            <Link 
              to="/about" 
              className="bg-[#224266] text-white px-8 py-3 rounded hover:bg-[#1a3650] transition font-semibold"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Disaster Examples Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Flood Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src={floodImage} 
                alt="Flood in Kisumu" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Flood in Kisumu
                </h3>
                <p className="text-gray-600">
                  Heavy rains have caused severe flooding in Kisumu, displacing many residents. 
                  Shelter and supplies are urgently required to help affected families.
                </p>
              </div>
            </div>

            {/* Wildfire Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src={wildfireImage} 
                alt="Wildfire in Maasai Mara" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Wildfire in Maasai Mara National Park
                </h3>
                <p className="text-gray-600">
                  A devastating wildfire has spread through the national park, threatening wildlife 
                  and local communities. Emergency response teams are working to contain the blaze.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              to="/signup" 
              className="bg-[#224266] text-white px-8 py-3 rounded hover:bg-[#1a3650] transition font-semibold text-lg"
            >
              DONATE? SIGN UP
            </Link>
          </div>
        </div>
      </section>

      {/* How Disaster Connect Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How Disaster Connect Works:
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies disaster responses, connecting those in need with those who can help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-[#224266] rounded mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">VISION</h3>
              <p className="text-gray-600">
                To create a unified AI-based platform that bridges the gap between disaster victims and donors ensuring faster disaster relief and recovery.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-[#224266] rounded mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">MISSION</h3>
              <p className="text-gray-600">
                To empower communities with a digital tool that leverages AI to classify disaster incidents while enabling seamless collaboration between affected individuals and those offering help.
              </p>
            </div>

            {/* Goal Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-[#224266] rounded mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">GOAL</h3>
              <p className="text-gray-600">
                Facilitate rapid disaster reporting and communication to allow victims and witnesses to report incidents instantly through a web interface.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}