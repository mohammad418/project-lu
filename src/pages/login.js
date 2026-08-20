import "./login.css";
import image from "../assets/garage.jpg";

function login({ onBack, onSignupClick }) {
  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form">
        <b className="titr">سامانه مدیریت تعمیرگاه</b>
        <p className="log-second">لطفا وارد حساب کاربری خود شوید</p>
        <form action="" className="login">
          <input type="text" placeholder="نام کاربری" className="username" />
          <input type="password" placeholder="رمز عبور" className="password" />
          <div className="remember-box">
            <input type="checkbox" name="remember" id="remember" />
            <label htmlFor="remember">مرا به خاطر بسپار</label>
          </div>
          <input type="button" value="ورود" />
          <a href="#" onClick={(e) => e.preventDefault()}>
            رمز عبور را فراموش کرده اید؟
          </a>
          <a
            href="#signup"
            onClick={(e) => {
              e.preventDefault();
              if (onSignupClick) onSignupClick();
            }}
          >
            حساب ندارید؟ثبت نام کنید
          </a>
        </form>
        {onBack && (
          <button className="backkey" onClick={onBack}>
            بازگشت به صفحه اصلی
          </button>
        )}
      </div>
    </div>
  );
}

export default login;
