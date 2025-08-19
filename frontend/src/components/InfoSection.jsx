import React from 'react';

const InfoSection = () => (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
      {/* YouTube Video Embed */}
      <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/PJCzjeX3qds?si=wSYZM0qDYKH1n9Pl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose GuvBuy Procurement?</h2>
        <p className="text-gray-600 mb-6">
          GovBuy empowers you with precision and personalization in every order. Explore the benefits of tailored procurement:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Optimized product quality & supplier fit</li>
          <li>Customized technical & functional specs</li>
          <li>Efficient and transparent sourcing workflow</li>
        </ul>
        {/* <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">
          Apply for Bid
        </button> */}
      </div>
    </div>
  </section>
);

export default InfoSection;
