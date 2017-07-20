const React = require('react');
class PageHero extends React.Component {
  render() {
    const heroHeight = this.props.height
      ? 'hmin' + this.props.height
      : 'hmin360';
    return (
      <div
        className={`${heroHeight} px24 py24 flex-parent flex-parent--center-cross bg-${this
          .props.bgColor}`}
      >
        <div className="flex-child">
          <h1 className="txt-h1-mm txt-h2 txt-fancy">
            {this.props.title}
          </h1>
          <div className="txt-l-mxl mt6 mt24-xl">
            {this.props.description}
          </div>
        </div>
      </div>
    );
  }
}
module.exports = PageHero;
