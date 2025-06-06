export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white py-5">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            &copy; 2024 CodeExplorerRay. All rights reserved.
          </p>
          <div className="flex space-x-3">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white text-lg hover:text-yellow-400"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-white text-lg hover:text-yellow-400"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-white text-lg hover:text-yellow-400"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-white text-lg hover:text-yellow-400"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
