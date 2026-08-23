import "./services.css";
import image from "../assets/garage.jpg";

function Services({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-services">
        <b className="titr titr-services">تعمیرات و خدمات</b>
        <div className="body body-services"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه امکانات
          </button>
        )}
      </div>
    </div>
  );
}

export default Services;
