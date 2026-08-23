import "./customers.css";
import image from "../assets/garage.jpg";

function Customers({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-customers">
        <b className="titr titr-customers">مدیریت مشتریان</b>
        <div className="body body-customers"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه امکانات
          </button>
        )}
      </div>
    </div>
  );
}

export default Customers;
