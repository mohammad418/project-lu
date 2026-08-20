import { useState } from "react";
import "./signup.css";
import image from "../assets/garage.jpg";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function Signup({ onBack, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toEnglishDigits = (str) => {
    return str
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const handlePhoneChange = (e) => {
    const raw = toEnglishDigits(e.target.value);
    const digits = raw.replace(/\D/g, "");

    if (digits === "") {
      setPhone("");
      return;
    }

    if (!digits.startsWith("0")) {
      return;
    }

    if (digits.length <= 10) {
      setPhone(digits);
    }
  };

  const isEmailValid = (val) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
  };

  return (
    <div className="loginpage">
      <img src={image} alt="garage" className="log-img" />
      <div className="form">
        <b className="titr">سامانه مدیریت تعمیرگاه</b>
        <p className="log-second">لطفا حساب کاربری خود را ایجاد کنید</p>
        <form action="" className="login" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="نام کاربری"
            className="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            inputMode="numeric"
            className="password"
            placeholder="شماره تلفن"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={10}
          />

          <input
            type="email"
            className="password"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !isEmailValid(email) && (
            <span className="error-text">ایمیل صحیح نیست</span>
          )}

          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="تاریخ تولد"
            value={birthDate}
            onChange={setBirthDate}
            inputClass="password"
            containerStyle={{ width: "100%" }}
          />

          <input
            type="password"
            placeholder="رمز عبور"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="password"
            placeholder="تکرار رمز عبور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && password !== confirmPassword && (
            <span className="error-text">
              تکرار رمز عبور با رمز عبور یکسان نمیباشد
            </span>
          )}

          <div className="remember-box">
            <input type="checkbox" name="remember" id="remember" />
            <label htmlFor="remember">مرا به خاطر بسپار</label>
          </div>

          <input type="button" value="ثبت نام" />

          {onLoginClick && (
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                onLoginClick();
              }}
            >
              حساب کاربری دارید؟ وارد شوید
            </a>
          )}
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

export default Signup;
