const gulp      = require("gulp");
const postcss   = require("gulp-postcss");
const sass      = require("gulp-sass");
const rename    = require("gulp-rename");
const minify    = require("gulp-clean-css");
const prefixer  = require("gulp-autoprefixer");
const mq        = require("css-mqpacker");
const header    = require("gulp-header");
const size      = require("gulp-size");
const bs        = require("browser-sync");
const pkg       = require("./package.json");

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

	let processors = [mq()];
	let s = size({gzip: true});

	return gulp.src(options.scss_source)
		.pipe(sass().on("error", sass.logError))
		.pipe(prefixer({browsers: options.prefixer_versions }))
		.pipe(postcss(processors))
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