import "./contact.css";
import image from "../assets/garage.jpg";

function Contact({ onBack }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form form-contact">
        <b className="titr titr-contact">تماس با ما</b>
        <div className="body body-contact"></div>

        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه اصلی
          </button>
        )}
      </div>
    </div>
  );
}

export default Contact;
