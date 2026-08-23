import "./cars.css";
import image from "../assets/garage.jpg";

function Cars({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-cars">
        <b className="titr titr-cars">مدیریت خودروها</b>
        <div className="body body-cars"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه امکانات
          </button>
        )}
      </div>
    </div>
  );
}

export default Cars;
