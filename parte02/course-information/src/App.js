import React from 'react';
import Course from './Course';

import courses from "./courses.json";

export default function App() {
    return courses.map((course) => {
        return <Course key={course.id} course={course} />;
    });
}