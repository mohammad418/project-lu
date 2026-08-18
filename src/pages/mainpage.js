import "./mainpage.css";
import image from "../assets/garage.png";
function MainPage() {
  return (
    <div className="mainpage">
      <div className="headermain">
        <div className="headerright">
          <button className="loginbutton">
            <a href="##">
              ورود&nbsp; به&nbsp; سیستم &nbsp;&nbsp;
              <i class="fa fa-expeditedssl"></i>
            </a>
          </button>
        </div>
        <div className="headercenter">
          <h1>
            <a href="#">صفحه اصلی</a>
          </h1>
          <h1>
            {" "}
            <a href="#">درباره ما</a>
          </h1>{" "}
          <h1>
            <a href="#">امکانات</a>
          </h1>
          <h1>
            <a href="#">تماس با ما</a>
          </h1>
        </div>
        <div className="headerleft">
          <h1>
            گاراژ <span></span>
            <span className="icon-stack" id="caricon">
              <i className="fa fa-gears"></i>
            </span>
          </h1>
          <h2>سامانه مدیریت تعمیرگاه خودرو</h2>
        </div>
      </div>
      <div className="body-main">
        <img src={image} alt="garage" className="img-m" />
        <div className="back"></div>
        <div className="text-main">
          <b>
            <p className="first">سامانه مدیریت</p>
            <p className="second">تعمیرگاه خودرو</p>
          </b>
          <p className="text">
            مدیریت آسان مشتریان،خودروها،تعمیرات،قطعات و فاکتور ها
            <br />
            همه در یک سیستم یکپارچه و هوشمند
          </p>
          <br />
          <button className="login-body">
            <a href="#">
              {" "}
              <i class="fa fa-sign-in"></i>&nbsp;&nbsp; ورود به سیستم
            </a>
          </button>
        </div>
        <div className="footer-main">
          <div>
            <a href="">
              <b>
                <p className="titr">
                  فاکتور ها و گزارش ها&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-file-text-o" id="text-o"></i>
                </p>
              </b>
              <p className="footer-text">
                صدور و فاکتور و مشاهده
                <br /> گزارش های مالی
              </p>
            </a>
          </div>
          <div>
            <a href="">
              <b>
                <p className="titr">
                  مدیریت قطعات&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-cubes" id="cubes"></i>
                </p>
              </b>
              <p className="footer-text">
                کنترل موجودی قطعات
                <br /> و لوازم یدکی
              </p>
            </a>
          </div>
          <div>
            <a href="">
              <b>
                <p className="titr">
                  تعمیرات و خدمات&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-wrench" id="wrench"></i>
                </p>
              </b>
              <p className="footer-text">
                ثبت تعمیرات،هزینه ها و <br /> پیگیری وضعیت خدمات{" "}
              </p>
            </a>
          </div>
          <div>
            <a href="">
              <b>
                <p className="titr">
                  مدیریت خودرو ها&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-car" id="car"></i>
                </p>
              </b>
              <p className="footer-text">
                ثبت و مدیریت اطلاعات <br /> خودرو های مشتریان              </p>
            </a>
          </div>
          <div className="last-div">
            <a href="">
              <b>
                <p className="titr">
                 مدیریت مشتریان&nbsp;&nbsp;&nbsp;
                  <i class="fa fa-group" id="group"></i>
                </p>
              </b>
              <p className="footer-text">
                افزودن،ویرایش و پیگیری
                <br /> اطلاعات مشتریان
              </p>
            </a>
          </div>
        </div>
      </div>
      <footer>
        1405 تمامی حقوق محفوظ است - سامانه مدیریت تعمیرگاه خودرو
      </footer>
    </div>
  );
}

export default MainPage;
