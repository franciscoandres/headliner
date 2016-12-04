let gulp      = require("gulp");
let sass      = require("gulp-sass");
let rename    = require("gulp-rename");
let minify    = require("gulp-clean-css");
let prefixer  = require("gulp-autoprefixer");
let header    = require("gulp-header");
let size      = require("gulp-size");
let bs        = require("browser-sync");
let pkg       = require("./package.json")

let options  = {
	"prefixer_versions": ["last 2 versions"],
	"scss_source": "./source/*.scss",
	"css_dest": "./css/",
	"root_path": "./"
};

gulp.task("browser-sync", () => {
	bs({
		server: {
			baseDir: "./"
		}
	})
});

gulp.task("reload", () => {
	bs.reload();
});

gulp.task("sass", () => {

	let s = size({gzip: true});

	return gulp.src(options.scss_source)
		.pipe(sass().on("error", sass.logError))
		.pipe(prefixer({browsers: options.prefixer_versions }))
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(gulp.dest(options.css_dest))
		.pipe(minify())
		.pipe(rename({suffix: ".min"}))
		.pipe(s)
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(gulp.dest(options.css_dest));
});

gulp.task("default", ["browser-sync", "sass"], () => {
	gulp.watch("./source/*.scss", ["sass"]);
	gulp.watch("./*.html", ["reload"]);
})