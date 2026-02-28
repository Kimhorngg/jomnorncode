import React, { useState, useEffect } from "react";   
export default function RenderPopularHomepageCard() {
    const [courses, setCourses] = useState([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        fetch("https://fakestoreapi.com/products")
          .then((res) => res.json())
          .then((data) => {
            setCourses(data);
            setLoading(false);
          });
      }, []);
    if (loading) {
    return <h1 className="text-center mt-20 mb-20 text-2xl">កំពុងដំណេីរការ...</h1>;
  }
    return(
       <div className="min-h-screen bg-gray-100 py-16 dark:bg-[#0e172b]">
          <div className="max-w-425 mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-[#112d4f]">
                វគ្គសិក្សាដែលពេញនិយម
              </h1>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:px-20">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <div className="h-70 flex items-center justify-center bg-gray-200">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-24 object-contain"
                    />
                  </div>

                  <div className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 mb-4 text-sm">
                      {course.description.slice(0, 80)}...
                    </p>

                    <p className="font-bold text-blue-600 mb-4">
                      ${course.price}
                    </p>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300">
                      ចុចដើម្បីរៀន
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    )
 
}