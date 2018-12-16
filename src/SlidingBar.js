import React from 'react';

export default class SlidingBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            isDragging: false,
            mouseOffset: 0,
        };
        this.startDragging = this.startDragging.bind(this);
        this.finishDragging = this.finishDragging.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'mouseup',
            this.finishDragging,
        );
        window.addEventListener(
            'mousemove',
            this.updatePosition,
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            'mouseup',
            this.finishDragging,
        );
        window.removeEventListener(
            'mousemove',
            this.updatePosition,
        );
    }

    startDragging(e) {
        const {left: startPosition} = this.slider.getBoundingClientRect();
        const mouseOffset = e.clientX - startPosition;
        e.preventDefault();
        this.setState({
            isDragging: true,
            mouseOffset,
        });
    }

    finishDragging(e) {
        e.preventDefault();
        this.setState({
            isDragging: false,
        });
    }

    updatePosition(e) {
        const min = 0;
        const max = 100;
        let position;
        if(this.state.isDragging) {
            const mousePosition = e.clientX;
            const mouseOffset = this.state.mouseOffset;
            const {x, width} = this.slidingTrack.getBoundingClientRect();
            const distance = Math.round(
                ((mousePosition - mouseOffset - x) / width) * 100
            ).toFixed(2);
            if(distance < min) {
                position = min;
            } else if(distance > max) {
                position = max;
            } else {
                position = distance;
            }
            this.setState({
                position,
            });
        }
    }

    render() {
        const position = this.state.position;
        return (
            <>
                <div
                    className="wrapper"
                    ref={(el) => (this.slidingTrack = el)}
                >
                    <div
                        className="slider"
                        onMouseDown={this.startDragging}
                        onMouseMove={this.updatePosition}
                        onMouseUp={this.finishDragging}
                        ref={(el) => (this.slider = el)}
                        style={{left: `${position}%`}}
                    >
                    </div>
                </div>
                {this.state.isDragging && 'dragging'}
            </>
        );
    }
}
