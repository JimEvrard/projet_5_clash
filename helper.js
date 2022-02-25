
export class helper {

    static template_image(template) {
        console.log('test function');
        switch (template) {
            case 'barbarian':
                template = './templates/template_barbarian.html.twig'
                break;
            case 'archer':
                template = './templates/template_archer.html.twig'
                break;
            case 'wizard':
                template = './templates/template_wizard.html.twig'
                break;
            case 'giant':
                template = './templates/template_giant.html.twig'
                break;
            case 'goblin':
                template = './templates/template_goblin.html.twig'
                break;
        }
        return template;
    }
}


export default helper;