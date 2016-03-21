var gulp = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    sass = require("gulp-sass");
    
gulp.task("sass", function () {
    gulp.src("./styles/app.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed",
            imagePath: "../img",
            sourceMap: true,
            outFile: "app.css"
        }))
        .on("error", function(err) { console.log(err) })
        .pipe(sourcemaps.write("../maps", {
            sourceRoot: "../styles"
        }))
        .pipe(gulp.dest("./www/css"));
});    