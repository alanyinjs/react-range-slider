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
        if(this.state.isDragging) {
            // get position and width of the track
            const {
                x,
                width: trackWidth,
            } = this.slidingTrack.getBoundingClientRect();
            const {width: sliderWidth} = this.slider.getBoundingClientRect();
            // get mouse offset position on slider
            const mouseOffset = this.state.mouseOffset;
            const maxSlidingWidth = trackWidth - sliderWidth;
            const mousePosition = e.clientX;
            // get percentage mouse position relative to left edge
            const percentageDistance = (
                (mousePosition - mouseOffset - x) / maxSlidingWidth
            ) * 100;
            // set left and right boundaries of slider
            const min = 0;
            const max = (trackWidth - sliderWidth) / trackWidth * 100;
            let position;
            if(percentageDistance < min) {
                position = min.toFixed(2);
            } else if(percentageDistance > max) {
                position = max.toFixed(2);
            } else {
                position = percentageDistance.toFixed(2);
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
