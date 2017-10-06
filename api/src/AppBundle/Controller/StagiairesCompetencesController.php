<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest;
use AppBundle\Form\StagiairesCompetencesType;
use AppBundle\Entity\StagiairesCompetences;
use AppBundle\Entity\StagesStagiaires;

/**
 * Stagiairescompetence controller.
 */
class StagiairesCompetencesController extends Controller
{
    /**
     * Lists all stagiairesCompetence entities.
     *
     * @Rest\View()
     * @Rest\Get("/stagiairescompetences")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $stagiairesCompetences = $em->getRepository('AppBundle:StagiairesCompetences')->findAll();

        return $stagiairesCompetences;
    }

    /**
     *
     * @Rest\View()
     * @Rest\Get("/mycompetences/{id_stage}")
     */
    public function myCompetences($id_stage) {
        $em = $this->getDoctrine()->getManager();
        $stagiairesCompetences = $em->getRepository('AppBundle:StagiairesCompetences')
        ->findByIdStage($id_stage);
        
        return $stagiairesCompetences;
    }

    /**
     * Creates a new stagiairesCompetence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/stagiairescompetences/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $stagiairescompetences = new Stagiairescompetences();
        
        $em = $this->getDoctrine()->getManager();
        $stage = $em->getRepository('AppBundle:Stages')->find($request->get('id_stage'));
        $competence = $em->getRepository('AppBundle:Competences')->find($request->get('id_competence'));

        $stagiairescompetences
        ->setIdStage($stage)
        ->setIdCompetence($competence)
        ->setValidationStagiaire($request->get('validation_stagiaire'))
        ->setNoteStagiaire($request->get('note_stagiaire'))
        ->setCompetenceStagiaire($request->get('competence_stagiaire'))
        ->setValidationMaitreDeStage($request->get('validation_maitre_de_stage'))
        ->setNoteMaitreDeStage($request->get('note_maitre_de_stage'))
        ->setCompetenceMaitreDeStage($request->get('competence_maitre_de_stage'))
        ->setValidationResponsable($request->get('validation_responsable'));

        if ($stagiairescompetences->getIdStage() == null ||
            $stagiairescompetences->getIdCompetence() == null ||
            $stagiairescompetences->getNoteStagiaire() == null ||
            $stagiairescompetences->getValidationMaitreDeStage() == null ||
            $stagiairescompetences->getValidationStagiaire() == null ||
            $stagiairescompetences->getNoteMaitreDeStage() == null ||
            $stagiairescompetences->getValidationResponsable() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
    }

    $em = $this->get('doctrine.orm.entity_manager');
    $em->persist($stagiairescompetences);
    $em->flush();

    return $stagiairescompetences;
}

    /**
     * Finds and displays a stagiairesCompetence entity.
     *
     * @Rest\View()
     * @Rest\Get("/stagiairescompetences/{id}")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stagiairescompetences = $em->getRepository('AppBundle:StagiairesCompetences')->find($id);

        return $stagiairescompetences;
    }

    /**
     * Displays a form to edit an existing competence entity.
     *
     * @Rest\View()
     * @Rest\Patch("/stagiairescompetences/{id}", name="edit_competence")
     */
    public function patchStagiairesCompetencesAction(Request $request)
    {
        return $this->updateStagiairesCompetences($request);
    }

    public function updateStagiairesCompetences(Request $request)
    {
        $stagiairescompetences = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:StagiairesCompetences')
        ->find($request->get('id'));

        if (empty($stagiairescompetences)) {
            return new JsonResponse(['message_err' => "La competence du stagiaire est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(StagiairesCompetencesType::class, $stagiairescompetences);
        $form->submit($request->request->all(), false);


        if ($request->get('validation_maitre_de_stage') && boolval($request->get('validation_maitre_de_stage')) !== boolval($stagiairescompetences->getValidationMaitreDeStage())) {
            $stagiairescompetences->setValidationMaitreDeStage(boolval($request->get('validation_maitre_de_stage')));
        } else {
            $stagiairescompetences->setValidationMaitreDeStage($stagiairescompetences->getValidationMaitreDeStage());
        }

        if ($request->get('validation_stagiaire') && boolval($request->get('validation_stagiaire')) !== boolval($stagiairescompetences->getValidationStagiaire())) {
            $stagiairescompetences->setValidationStagiaire(boolval($request->get('validation_stagiaire')));
        } else {
            $stagiairescompetences->setValidationStagiaire($stagiairescompetences->getValidationStagiaire());
        }

        if ($request->get('validation_responsable') && boolval($request->get('validation_responsable')) !== boolval($stagiairescompetences->getValidationResponsable())) {
            $stagiairescompetences->setValidationResponsable(boolval($request->get('validation_responsable')));
        } else {
            $stagiairescompetences->setValidationResponsable($stagiairescompetences->getValidationResponsable());
        }

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($stagiairescompetences);
            $em->flush();
            return $stagiairescompetences;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a competence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/stagiairescompetences/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stagiairescompetences = $em->getRepository('AppBundle:StagiairesCompetences')
        ->find($request->get('id'));

        if ($stagiairescompetences) {
            $em->remove($stagiairescompetences);
            $em->flush();
            return new JsonResponse(["message" => "La compétences du stagiaire a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "La compétences du stagiaire est introuvable !"]);
    }

     /**
     * @Rest\View()
     * @Rest\Post("/validation/{id_stage}")
     */
     public function demandeValidation($id_stage)
     {
        $stagiaire = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:StagesStagiaires')
        ->findOneByIdStage($id_stage);

        $maitreDeStage = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:StagesMaitresDeStage')
        ->findOneByIdStage($id_stage);

        $message = \Swift_Message::newInstance()
        ->setSubject('eplus - Demande de validation competences')
        ->setFrom('eplus.e2c@gmail.com')
        ->setTo($maitreDeStage->getIdMaitredeStage()->getIdUtilisateur()->getMail())
        ->setBody(
            $this->renderView(
                'emails/demande_validation.html.twig',
                array(
                    'nom' => $stagiaire->getIdStagiaire()->getNom(),
                    'prenom' => $stagiaire->getIdStagiaire()->getPrenom(),

                    )
                ), 'text/html');
        $this->get('mailer')->send($message);
    }
}
