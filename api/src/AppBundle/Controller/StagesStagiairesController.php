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
use AppBundle\Form\StagesType;
use AppBundle\Entity\Stages;
use AppBundle\Entity\StagesStagiaires;
use AppBundle\Entity\StagiairesCompetences;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Stagesstagiaire controller.
 *
 */
class StagesStagiairesController extends Controller
{
    /**
     * Lists all stagesStagiaire entities.
     *
     * @Rest\View()
     * @Rest\Get("/stagesstagiaires")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $stagesstagiaires = $em->getRepository('AppBundle:StagesStagiaires')->findAll();

        return $stagesstagiaires;
    }

    /**
     * Finds and displays a stage entity.
     *
     * @Rest\View()
     * @Rest\Get("/mystages/{id}")
     */
    public function mystages($id) {
        $em = $this->getDoctrine()->getManager();
        $stages = $em->getRepository('AppBundle:StagesStagiaires')->findByIdStagiaire($id);

        return $stages;
    }

    /**
     * Creates a new stagesStagiaire entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/stagesstagiaires/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $stagesstagiaires = new StagesStagiaires();
        
        $em = $this->getDoctrine()->getManager();
        $stage = $em->getRepository('AppBundle:Stages')->find($request->get('id_stage'));
        $stagiaire = $em->getRepository('AppBundle:Stagiaires')->find($request->get('id_stagiaire'));

        $stagesstagiaires->setIdStage($stage)
        ->setIdStagiaire($stagiaire);
        if ($stagesstagiaires->getIdStage() == null || $stagesstagiaires->getIdStagiaire() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }

        $em = $this->get('doctrine.orm.entity_manager');
        $em->persist($stagesstagiaires);
        $em->flush();

        $competences = $em->getRepository('AppBundle:Competences')->findByIdMetier($stage->getIdMetier());

        foreach ($competences as $key => $competence) {

            $stagiairescompetences = new Stagiairescompetences();

            $stagiairescompetences
            ->setIdStage($stage)
            ->setIdCompetence($competence)
            ->setValidationStagiaire(0)
            ->setNoteStagiaire(0)
            ->setCompetenceStagiaire(0)
            ->setValidationMaitreDeStage(0)
            ->setNoteMaitreDeStage(0)
            ->setCompetenceMaitreDeStage(0)
            ->setValidationResponsable(0);

            $em->persist($stagiairescompetences);
            $em->flush();
        }

        return $stagesstagiaires;
    }

    /**
     * Finds and displays a stagesStagiaire entity.
     *
     * @Rest\View()
     * @Rest\Get("/stagesstagiaires/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stagesstagiaires = $em->getRepository('AppBundle:StagesStagiaires')->find($id);

        return $stagesstagiaires;
    }

    /**
     * Displays a form to edit an existing competence entity.
     *
     * @Rest\View()
     * @Rest\Patch("/stagesstagiaires/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchStagesStagiairesAction(Request $request)
    {
        return $this->updateStagesStagiaires($request);
    }

    public function updateStagesStagiaires(Request $request)
    {
        $stagesstagiaires = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:StagesStagiaires')
        ->find($request->get('id'));

        if (empty($stagesstagiaires)) {
            return new JsonResponse(['message_err' => "Le stage du stagiaire est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(CompetencesType::class, $stagesstagiaires);
        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($stagesstagiaires);
            $em->flush();
            return $stagesstagiaires;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a competence entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/stagesstagiaires/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stagesstagiaires = $em->getRepository('AppBundle:StagesStagiaires')
        ->find($request->get('id'));

        if ($stagesstagiaires) {
            $em->remove($stagesstagiaires);
            $em->flush();
            return new JsonResponse(["message" => "Le stage du stagiaire a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le stage du stagiaire est introuvable !"]);
    }
}
