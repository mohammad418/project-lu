import "./invoices.css";
import image from "../assets/garage.jpg";

function Invoices({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-invoices">
        <b className="titr titr-invoices">فاکتورها و گزارش‌ها</b>
        <div className="body body-invoices"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه امکانات
          </button>
        )}
      </div>
    </div>
  );
}

export default Invoices;
