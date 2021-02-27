

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

function fileEncodingBase64(){
    var file = document.querySelector('#file').files[0];
    getBase64(file).then(
      data => console.log(data)
    );
}
