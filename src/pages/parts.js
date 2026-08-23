import "./parts.css";
import image from "../assets/garage.jpg";

function Parts({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-parts">
        <b className="titr titr-parts">مدیریت قطعات</b>
        <div className="body body-parts"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه امکانات
          </button>
        )}
      </div>
    </div>
  );
}

export default Parts;
