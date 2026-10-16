import useInView from "../hooks/useInView";

export default function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={`${visible ? "reveal" : "opacity-0"} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
