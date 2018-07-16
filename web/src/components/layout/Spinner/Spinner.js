import React from 'react';
import './spinner.css'

class Spinner extends React.Component{ 
    constructor(props) {
        super(props);
        this.enableSpinner = this.enableSpinner.bind(this);

        this.state = {
            displaySpinner: false,
        };

        this.timer = setTimeout(this.enableSpinner, 200);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    
    enableSpinner() {
        this.setState({displaySpinner: true});
    }
    
    render() {
        const {displaySpinner} = this.state;
    
        if (!displaySpinner) {
          return null;
        }
    
        return (<div className="sk-cube-grid">
                <div className="sk-cube sk-cube1"></div>
                <div className="sk-cube sk-cube2"></div>
                <div className="sk-cube sk-cube3"></div>
                <div className="sk-cube sk-cube4"></div>
                <div className="sk-cube sk-cube5"></div>
                <div className="sk-cube sk-cube6"></div>
                <div className="sk-cube sk-cube7"></div>
                <div className="sk-cube sk-cube8"></div>
                <div className="sk-cube sk-cube9"></div>
                </div>);
    }
}

export default Spinner;
