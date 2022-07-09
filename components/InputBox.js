import React from "react";
import styles from '../styles/Editor.module.css'

class InputBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: props.min}

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
        this.props.onChange(event.target.value)
    }

    render() {
        return (
            <label>
                {this.props.before_label}
                <input type={'number'} min={this.props.min} max={this.props.max} size={this.props.size} value={this.state.value} onChange={this.handleChange} style={{textAlign: 'center'}}/>
                {this.props.after_label}
            </label>
        );
    }
}

export default InputBox