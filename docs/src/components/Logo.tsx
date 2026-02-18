import { Component } from "solid-js";

const Logo: Component<{ class?: string }> = (props) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class={props.class}
    >
      {/* Yellow Brackets (Senior Engineer Vibes) */}
      <path 
        d="M50 40C30 40 30 60 30 80V90C30 100 20 100 20 100C20 100 30 100 30 110V120C30 140 30 160 50 160" 
        stroke="#f59e0b" 
        stroke-width="12" 
        stroke-linecap="round"
      />
      <path 
        d="M150 40C170 40 170 60 170 80V90C170 100 180 100 180 100C180 100 170 100 170 110V120C170 140 170 160 150 160" 
        stroke="#f59e0b" 
        stroke-width="12" 
        stroke-linecap="round"
      />
      
      {/* Cyan Paper Plane (Fast/Modern) */}
      <path 
        d="M140 100L60 135L75 100L60 65L140 100Z" 
        fill="#14b8a6" 
        class="dark:fill-primary-400"
      />
      <path 
        d="M75 100L140 100" 
        stroke="rgba(255,255,255,0.5)" 
        stroke-width="2" 
        stroke-linecap="round"
      />
    </svg>
  );
};

export default Logo;
