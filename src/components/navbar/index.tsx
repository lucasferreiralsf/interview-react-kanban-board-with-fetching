import "./index.css";

interface NavbarProps {
  header: string;
}

export default function Navbar({ header }: NavbarProps) {
  return (
    <div className="app-header">
      <div className="layout-row align-items-center justify-content-center">
        <h4 id="app-title" className="app-title ml-16 my-0">
          {header}
        </h4>
      </div>
    </div>
  );
}
