const Targeting = Vue.createApp({
    data() {
        return {
            Show: false,
            ChangeTextIconColor: false, // This is if you want to change the color of the icon next to the option text with the text color
            StandardEyeIcon: 'https://media.discordapp.net/attachments/1225539056017080330/1242173119733694556/normaleye.png?ex=664cdf5e&is=664b8dde&hm=0974aa1b59a7b3cfdfa9cfa53c8092f19159b4bb4fbdd19a1cd041f0fb14d5ac&=&format=webp&quality=lossless', // Instead of icon it's using a image source found in HTML 
            CurrentIcon: 'https://media.discordapp.net/attachments/1225539056017080330/1242173119733694556/normaleye.png?ex=664cdf5e&is=664b8dde&hm=0974aa1b59a7b3cfdfa9cfa53c8092f19159b4bb4fbdd19a1cd041f0fb14d5ac&=&format=webp&quality=lossless', // Instead of icon it's using a image source found in HTML
            SuccessIcon: 'https://media.discordapp.net/attachments/771322569235759115/1242172082029334698/activeeye.png?ex=664cde66&is=664b8ce6&hm=c2e6034c61d86065acb13448844eb105179098d38b0d77654420baaf7cbe77c2&=&format=webp&quality=lossless', // Instead of icon it's using a image source found in HTML
            SuccessColor: "rgb(5, 241, 178)",
            StandardColor: "white",
            TargetHTML: "",
            TargetEyeStyleObject: {
                color: "white", // This is the standardcolor, change this to the same as the StandardColor if you have changed it
            },
        }
    },
    destroyed() {
        window.removeEventListener("message", this.messageListener);
        window.removeEventListener("mousedown", this.mouseListener);
        window.removeEventListener("keydown", this.keyListener);
    },
    mounted() {
        this.messageListener = window.addEventListener("message", (event) => {
            switch (event.data.response) {
                case "openTarget":
                    this.OpenTarget();
                    break;
                case "closeTarget":
                    this.CloseTarget();
                    break;
                case "foundTarget":
                    this.FoundTarget(event.data);
                    break;
                case "validTarget":
                    this.ValidTarget(event.data);
                    break;
                case "leftTarget":
                    this.LeftTarget();
                    break;
            }
        });

        this.mouseListener = window.addEventListener("mousedown", (event) => {
            let element = event.target;
            let split = element.id.split("-");
            if (split[0] === 'target' && split[1] !== 'eye') {
                $.post(`https://${GetParentResourceName()}/selectTarget`, JSON.stringify(Number(split[1]) + 1));
                this.TargetHTML = "";
                this.Show = false;
            }

            if (event.button == 2) {
                this.CloseTarget();
                $.post(`https://${GetParentResourceName()}/closeTarget`);
            }
        });

        this.keyListener = window.addEventListener("keydown", (event) => {
            if (event.key == 'Escape' || event.key == 'Backspace') {
                this.CloseTarget();
                $.post(`https://${GetParentResourceName()}/closeTarget`);
            }
        });
    },
    methods: {
        OpenTarget() {
            this.TargetHTML = "";
            this.Show = true;
            this.TargetEyeStyleObject.color = this.StandardColor;
        },

        CloseTarget() {
            this.TargetHTML = "";
            this.TargetEyeStyleObject.color = this.StandardColor;
            this.Show = false;
            this.CurrentIcon = this.StandardEyeIcon;
        },

        FoundTarget(item) {
            if (item.data) {
                this.CurrentIcon = item.data;
            } else {
                this.CurrentIcon = this.SuccessIcon;
            }
            this.TargetEyeStyleObject.color = this.SuccessColor;
        },

        ValidTarget(item) {
            this.TargetHTML = "";
            let TargetLabel = this.TargetHTML;
            const FoundColor = this.SuccessColor;
            const ResetColor = this.StandardColor;
            const AlsoChangeTextIconColor = this.ChangeTextIconColor;
            item.data.forEach(function(item, index) {
                if (AlsoChangeTextIconColor) {
                    TargetLabel += "<div id='target-" + index + "' style='margin-bottom: 1vh;'><span id='target-icon-" + index + "' style='color: " + ResetColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                } else {
                    TargetLabel += "<div id='target-" + index + "' style='margin-bottom: 1vh;'><span id='target-icon-" + index + "' style='color: " + FoundColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                };

                setTimeout(function() {
                    const hoverelem = document.getElementById("target-" + index);

                    hoverelem.addEventListener("mouseenter", function(event) {
                        event.target.style.color = FoundColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = FoundColor;
                        };
                    });

                    hoverelem.addEventListener("mouseleave", function(event) {
                        event.target.style.color = ResetColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = ResetColor;
                        };
                    });
                }, 10)
            });
            this.TargetHTML = TargetLabel;
        },

        LeftTarget() {
            this.TargetHTML = "";
            this.CurrentIcon = this.StandardEyeIcon;
            this.TargetEyeStyleObject.color = this.StandardColor;
        }
    }
});

Targeting.use(Quasar, {
    config: {
        loadingBar: { skipHijack: true }
    }
});
Targeting.mount("#target-wrapper");
