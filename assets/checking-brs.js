<script>
document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Hệ Thống API Toàn Cầu">
  <meta name="author" content="DVSTEAM.VN">
  <title>Hệ Thống API BANK DVSTEAM</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"><\/script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Pattaya|Potta One|Rowdies|Braah One|Chivo">
  <link rel="icon" href="https://vuvankien.com/assets/img/avt.png">
</head>
<body class="bodystyle">
<style>
* {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none
}
body {
  background-color: #fcfcfc;
  background-size: cover;
  background-position: center;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.Container {
  text-align: center;
  margin-top: 5%;
  width: 100%;
  overflow: hidden;
  font-size: 1em;
}
@media (max-width: 768px) {
  .Container {
    margin-top: 15%;
    font-size: 0.8em; 
  }
}
.bodystyle {
  position: fixed;
  top: 5px;
  left: 0;
  width: 100%;
  height: 99%;
  text-align: center;
  background-color: #111;
  margin: 0;
  padding: 0;
  border-style: double;
  border-radius: 20px;
  border-color: #ccc;
  border-width: 2px;
  box-sizing: border-box;
  animation-name: bodyborder;
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-direction: right;
}
@keyframes bodyborder {
  30% { border-color: #666 }
  60% { border-color: #999 }
  90% { border-color: #ccc }
}
@media (max-width: 768px) {
  .bodystyle {
    top: 6px;
    left: 5px;
    width: 98%;
    height: 99%;
  }
}
ul { margin: 0; padding: 0 }
h1 {
  color: #fff;
  font-family: 'Rowdies';
}
h2 {
  font-family: 'Braah One';
  font-size: 25px;
  color: silver;
}
.pulse-container {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center
}
.pulse-bubble {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: violet;
}
.pulse-bubble-1 { animation: pulse .4s ease 0s infinite alternate }
.pulse-bubble-2 { animation: pulse .4s ease .2s infinite alternate }
.pulse-bubble-3 { animation: pulse .4s ease .4s infinite alternate }
@keyframes pulse {
  from { opacity: 1; transform: scale(1) }
  to { opacity: .25; transform: scale(.75) }
}
.Blob {
  background: black;
  border-radius: 15%;
  margin: 40px;
  height: 150px;
  width: 150px; 
  box-shadow: 0 1px 7px rgb(231, 231, 231);
  margin-top: 70px;
}
</style>
<section>
  <div class="Container">
    <img class="Blob" src="https://i.gifer.com/origin/05/05bd96100762b05b616fb2a6e5c223b4_w200.gif" alt="dvsteam">
    <h1>HỆ THỐNG API BANK DVSTEAM</h1>
    <p style="font-family: Chivo;color: rgb(216, 216, 216);">Đang Kiểm Tra Trình Duyệt Của Bạn<br> Vui lòng đợi dây lát</p>
    <strong style="color: rgb(216, 216, 216);font-family: Chivo;">Power by
      <a style="color: #a690d6;" href="https://m.facebook.com/admin.dvsteam.net" target="about:blank">DVSTEAM.VN</a>
    </strong>
  </div>
</section>
<div style="margin-top: 15px;" class="Container">
  <h2>- Waiting Security -</h2>
  <center> 
    <div class="pulse-container">
      <div class="pulse-bubble pulse-bubble-1"></div>
      <div class="pulse-bubble pulse-bubble-2"></div>
      <div class="pulse-bubble pulse-bubble-3"></div>
    </div>
  </center>
</div>
</body>
</html>
`);
</script>
