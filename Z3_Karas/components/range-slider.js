class RangeSlider extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open'});

        this.min = this.getAttribute('minimal') ? this.getAttribute('minimal') : 0;
        this.max = this.getAttribute('maximal') ? this.getAttribute('maximal') : 10;
        this.defaultValue = this.getAttribute('default') ? parseInt(this.getAttribute('default')) : 0;

        this.inputTypeNumber = document.createElement('input');
        this.inputTypeNumber.type = 'number';
        this.inputTypeNumber.className = 'custom-number';
        this.inputTypeNumber.setAttribute('min', this.min);
        this.inputTypeNumber.setAttribute('max', this.max);
        this.inputTypeNumber.value = this.defaultValue;

        this.inputTypeRange = document.createElement('input');
        this.inputTypeRange.type = 'range';
        this.inputTypeRange.className = 'custom-range';
        this.inputTypeRange.setAttribute('min', this.min);
        this.inputTypeRange.setAttribute('max', this.max);
        this.inputTypeRange.value = this.defaultValue;

        this.container = document.createElement('div');
        this.container.className = 'container';

        this.container.appendChild(this.inputTypeRange);
        this.container.appendChild(this.inputTypeNumber);

        const style = document.createElement('style');
        style.innerHTML = `
                .container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    width: 10rem;
                 }
                 .custom-range{
                    -webkit-appearance: none;
                    margin-bottom: 14px;
                    width: 100%;
                    height: 12px;
                    border: 1px solid darkgrey;
                    border-radius: 3px;  
                    background: white;
                    opacity: 0.8;
                    -webkit-transition: .2s;
                    transition: opacity .2s;
                 }
                 .custom-range::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 40px;
                      height: 25px;
                      border-radius: 3px; 
                      background: whitesmoke;
                      border: 1px solid darkgrey;
                      cursor: pointer;
                }
                
                .custom-range::-moz-range-thumb {
                  -webkit-appearance: none;
                      appearance: none;
                      width: 40px;
                      height: 25px;
                      border-radius: 3px; 
                      background: whitesmoke;
                      border: 1px solid darkgrey;
                      cursor: pointer;
                }
                .custom-number{
                -webkit-appearance: none;
                    width: 100%;
                    height: 25px;
                    border: 1px solid darkgrey;
                    border-radius: 3px;  
                    background: whitesmoke;
                    opacity: 0.8;
                }
                   `;

        this.shadowRoot.appendChild(this.container);
        this.shadowRoot.appendChild(style);

        this.inputTypeRange.addEventListener('input', this.updateNumberInput.bind(this));
        this.inputTypeNumber.addEventListener('input', this.updateSlider.bind(this));
    }

    connectedCallback() {
        // Dispatch initial value
        this.dispatchValueChangedEvent();
    }
    updateNumberInput() {
        if (this.inputTypeNumber.value > this.max) {
            this.inputTypeNumber.value = this.max;
        }
        if (this.inputTypeNumber.value < this.min) {
            this.inputTypeNumber.value = this.min;
        }
        this.inputTypeNumber.value = this.inputTypeRange.value;
        this.dispatchValueChangedEvent();
    }

    updateSlider() {
        if (this.inputTypeNumber.value > this.max) {
            this.inputTypeNumber.value = this.max;
        }
        if (this.inputTypeNumber.value < this.min) {
            this.inputTypeNumber.value = 1;
        }
        this.inputTypeRange.value = this.inputTypeNumber.value;
        this.dispatchValueChangedEvent();
    }
    dispatchValueChangedEvent() {
        const event = new CustomEvent('valueChanged', {
            bubbles: true,
            composed: true,
            detail: { value: this.inputTypeRange.value }
        });

        this.dispatchEvent(event);
    }
}

customElements.define("range-slider", RangeSlider);