import styled from "styled-components";

const Blurred = styled.div`
  filter: blur(${props => (props.blurEnabled ? props.blurAmount : 0)});
  transition: filter ${props => props.transitionDuration} ease;
`;

Blurred.defaultProps = {
  blurAmount: "1rem",
  blurEnabled: false,
  transitionDuration: "2s",
};

export default Blurred;
